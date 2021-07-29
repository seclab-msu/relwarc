import { filterByDomain, DomainFilteringMode } from '../../src/analyzer/domain-filtering';

describe('Unit-tests for domain-filtering module', () => {
    it('filterByDomain Any mode: subdomain', () => {
        const url = 'http://example.subdomain.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Any);
        expect(res).toBeTrue();
    });

    it('filterByDomain Any mode: different domains', () => {
        const url = 'http://example.subdomain.com';
        const baseUrl = 'http://another-domain.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Any);
        expect(res).toBeTrue();
    });

    it('filterByDomain Any mode: same domains', () => {
        const url = 'http://example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Any);
        expect(res).toBeTrue();
    });

    it('filterByDomain Subdomain mode: subdomain', () => {
        const url = 'http://subdomain.example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Subdomain);
        expect(res).toBeTrue();
    });

    it('filterByDomain Subdomain mode: different domains', () => {
        const url = 'http://subdomain-example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Subdomain);
        expect(res).toBeFalse();
    });

    it('filterByDomain Subdomain mode: different domains', () => {
        const url = 'http://example.subdomain.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Subdomain);
        expect(res).toBeFalse();
    });

    it('filterByDomain Subdomain mode: same domain', () => {
        const url = 'http://subdomain.example.com';
        const baseUrl = 'http://subdomain.example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Subdomain);
        expect(res).toBeTrue();
    });

    it('filterByDomain Same mode: same domain', () => {
        const url = 'http://example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Same);
        expect(res).toBeTrue();
    });

    it('filterByDomain Same mode: different domain', () => {
        const url = 'http://example.com';
        const baseUrl = 'http://anotherexample.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Same);
        expect(res).toBeFalse();
    });

    it('filterByDomain Same mode: different domain', () => {
        const url = 'http://example.com';
        const baseUrl = 'http://anotherexample.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Same);
        expect(res).toBeFalse();
    });

    it('filterByDomain Same mode: subdomain', () => {
        const url = 'http://api.example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.Same);
        expect(res).toBeFalse();
    });

    it('filterByDomain SecondLevel mode: same domain', () => {
        const url = 'http://example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.SecondLevel);
        expect(res).toBeTrue();
    });
    it('filterByDomain SecondLevel mode: subdomain', () => {
        const url = 'http://api.example.com';
        const baseUrl = 'http://example.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.SecondLevel);
        expect(res).toBeTrue();
    });
    it('filterByDomain SecondLevel mode: completely different domains', () => {
        const url = 'http://example.subdomain.com';
        const baseUrl = 'http://another-domain.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.SecondLevel);
        expect(res).toBeFalse();
    });
    it('filterByDomain SecondLevel mode: different subdomains', () => {
        const url = 'http://a.domain.com';
        const baseUrl = 'http://b.domain.com';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.SecondLevel);
        expect(res).toBeTrue();
    });
    it('filterByDomain SecondLevel mode: different subdomains with longer tld', () => {
        const url = 'http://a.domain.co.uk';
        const baseUrl = 'http://b.domain.co.uk';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.SecondLevel);
        expect(res).toBeTrue();
    });
    it('filterByDomain SecondLevel mode: different domains with longer tld', () => {
        const url = 'http://a.onedomain.co.uk';
        const baseUrl = 'http://b.otherdomain.co.uk';
        const res = filterByDomain(url, baseUrl, DomainFilteringMode.SecondLevel);
        expect(res).toBeFalse();
    });
});
