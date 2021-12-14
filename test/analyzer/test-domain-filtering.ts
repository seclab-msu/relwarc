import { filterByDomain, DomainFilteringMode } from '../../src/domain-filtering';

describe('Unit-tests for domain-filtering module', () => {
    describe('filterByDomain Any mode', () => {
        const mode = DomainFilteringMode.Any;

        it('subdomain', () => {
            const url = 'http://example.subdomain.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });

        it('different domains', () => {
            const url = 'http://example.subdomain.com';
            const baseUrl = 'http://another-domain.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });

        it('same domains', () => {
            const url = 'http://example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });
    });
    describe('filterByDomain Subdomain mode', () => {
        const mode = DomainFilteringMode.Subdomain;

        it('subdomain', () => {
            const url = 'http://subdomain.example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });

        it('different domains', () => {
            const url = 'http://subdomain-example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });

        it('different domains', () => {
            const url = 'http://example.subdomain.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });

        it('same domain', () => {
            const url = 'http://subdomain.example.com';
            const baseUrl = 'http://subdomain.example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });
    });
    describe('filterByDomain Same mode', () => {
        const mode = DomainFilteringMode.Same;

        it('same domain', () => {
            const url = 'http://example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });

        it('different domain', () => {
            const url = 'http://example.com';
            const baseUrl = 'http://anotherexample.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });

        it('different domain', () => {
            const url = 'http://example.com';
            const baseUrl = 'http://anotherexample.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });

        it('subdomain', () => {
            const url = 'http://api.example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });
    });
    describe('filterByDomain SecondLevel mode', () => {
        const mode = DomainFilteringMode.SecondLevel;

        it('same domain', () => {
            const url = 'http://example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });
        it('subdomain', () => {
            const url = 'http://api.example.com';
            const baseUrl = 'http://example.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });
        it('completely different domains', () => {
            const url = 'http://example.subdomain.com';
            const baseUrl = 'http://another-domain.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });
        it('different subdomains', () => {
            const url = 'http://a.domain.com';
            const baseUrl = 'http://b.domain.com';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });
        it('different subdomains with longer tld', () => {
            const url = 'http://a.domain.co.uk';
            const baseUrl = 'http://b.domain.co.uk';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeTrue();
        });
        it('different domains with longer tld', () => {
            const url = 'http://a.onedomain.co.uk';
            const baseUrl = 'http://b.otherdomain.co.uk';
            const res = filterByDomain(url, baseUrl, mode);
            expect(res).toBeFalse();
        });
    });
});
