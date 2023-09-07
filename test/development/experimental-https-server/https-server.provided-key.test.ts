import { createNextDescribe } from 'e2e-utils'
import { Agent } from 'next/src/compiled/undici'
import { renderViaHTTP } from 'next-test-utils'

createNextDescribe(
  'experimental-https-server (provided certificate)',
  {
    files: __dirname,
    startCommand:
      'yarn next dev --experimental-https --experimental-https-key ./certificates/localhost-key.pem --experimental-https-cert ./certificates/localhost.pem',
  },
  ({ next }) => {
    const dispatcher = new Agent({ connect: { rejectUnauthorized: false } })

    it('should successfully load the app in app dir', async () => {
      expect(next.url).toInclude('https://')
      const html = await renderViaHTTP(next.url, '/1', undefined, {
        dispatcher,
      })
      expect(html).toContain('Hello from App')
    })

    it('should successfully load the app in pages dir', async () => {
      expect(next.url).toInclude('https://')
      const html = await renderViaHTTP(next.url, '/2', undefined, {
        dispatcher,
      })
      expect(html).toContain('Hello from Pages')
    })
  }
)
