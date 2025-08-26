import fetch from 'node-fetch';
import { wikiServer, scriptPath, username, password } from './config.js';
import { USER_AGENT } from '../server.js';

interface LoginResponse {
	clientlogin: {
		status: string;
		messagecode?: string;
		message?: string;
	};
}

interface LoginTokenResponse {
	query: {
		tokens: {
			logintoken: string;
		};
	};
}

class SessionManager {
	private cookies: string[] = [];
	private authenticated = false;
	private lastAuthCheck = 0;
	private readonly AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	async isAuthenticated(): Promise<boolean> {
		const now = Date.now();
		if (this.authenticated && (now - this.lastAuthCheck) < this.AUTH_CACHE_DURATION) {
			return true;
		}
		
		// Check if we have valid credentials
		const user = username();
		const pass = password();
		
		if (!user || !pass) {
			return false;
		}
		
		// Try to authenticate if not already done or cache expired
		if (!this.authenticated || (now - this.lastAuthCheck) >= this.AUTH_CACHE_DURATION) {
			return await this.login();
		}
		
		return this.authenticated;
	}

	private async getLoginToken(): Promise<string | null> {
		try {
			const response = await fetch(`${wikiServer()}${scriptPath()}/api.php`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': USER_AGENT,
					'Cookie': this.cookies.join('; ')
				},
				body: new URLSearchParams({
					action: 'query',
					meta: 'tokens',
					type: 'login',
					format: 'json'
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Update cookies from response
			this.updateCookies(response.headers.get('set-cookie'));

			const data = await response.json() as LoginTokenResponse;
			return data.query?.tokens?.logintoken || null;
		} catch (error) {
			console.error('Error getting login token:', error);
			return null;
		}
	}

	private async login(): Promise<boolean> {
		const user = username();
		const pass = password();
		
		if (!user || !pass) {
			return false;
		}

		try {
			// Get login token
			const token = await this.getLoginToken();
			if (!token) {
				console.error('Failed to get login token');
				return false;
			}

			// Perform login
			const response = await fetch(`${wikiServer()}${scriptPath()}/api.php`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': USER_AGENT,
					'Cookie': this.cookies.join('; ')
				},
				body: new URLSearchParams({
					action: 'clientlogin',
					username: user,
					password: pass,
					logintoken: token,
					loginreturnurl: wikiServer(),
					format: 'json'
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Update cookies from response
			this.updateCookies(response.headers.get('set-cookie'));

			const data = await response.json() as LoginResponse;
			
			if (data.clientlogin?.status === 'PASS') {
				this.authenticated = true;
				this.lastAuthCheck = Date.now();
				return true;
			} else {
				console.error('Login failed:', data.clientlogin?.message || data.clientlogin?.messagecode);
				return false;
			}
		} catch (error) {
			console.error('Error during login:', error);
			return false;
		}
	}

	private updateCookies(setCookieHeader: string | null): void {
		if (!setCookieHeader) return;

		const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
		
		for (const cookieString of cookiesArray) {
			const cookie = cookieString.split(';')[0];
			const [name] = cookie.split('=');
			
			// Remove existing cookie with same name
			this.cookies = this.cookies.filter(c => !c.startsWith(name + '='));
			
			// Add new cookie
			this.cookies.push(cookie);
		}
	}

	getCookies(): string {
		return this.cookies.join('; ');
	}

	logout(): void {
		this.cookies = [];
		this.authenticated = false;
		this.lastAuthCheck = 0;
	}
}

// Global session manager instance
const sessionManager = new SessionManager();

export { sessionManager };