import '../styles/globals.css'
import { useRouter } from 'next/router';
import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  let router = useRouter()
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      <link rel="canonical" href={`http://ssd.snabbfot.org${router.asPath}`} />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
