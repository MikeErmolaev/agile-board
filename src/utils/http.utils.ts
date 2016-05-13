import { Response } from 'angular2/http';

export function extractData(res: Response) {
	if (res.status < 200 || 300 <= res.status) {
		throw new Error('Bad response status: ' + res.status);
	}
	const body = res.json();
	return body.data || { };
}
