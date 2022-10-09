import '../styles/globals.css'
import { useRouter } from 'next/router';
import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  let router = useRouter()
  return <>
    <Head>
      <link rel="canonical" href={`http://ssd.snabbfot.org${router.asPath}`} />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
