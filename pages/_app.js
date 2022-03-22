import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (<div className="h-screen bg-gradient-to-r from-cyan-200 to-blue-200"><Component {...pageProps} /></div>)
}

export default MyApp
