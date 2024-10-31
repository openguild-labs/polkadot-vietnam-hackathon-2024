import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../public/css/loading.css';
import '../public/css/globals.css';
import '../public/css/local.css';
import { Provider } from 'react-redux'
import myStore from '@/script/store/store';
import { useMemo, useState } from 'react';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {

	return (
		<>
			<Head>
				<title>GNFT</title>
				<meta name="description" content="Your first step into the NFT world" />
				<meta name="author" content="Tommy" />
				<meta name="keywords" content="blockchain consultant, polkadot, unique network" />
				<meta property="og:title" content="GNFT" />
				<meta property="og:url" content="" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="" />
				<meta property="og:site-name" content="GNFT" />
				<meta property="og:description" content="Your first step into the NFT world" />
				<meta property="og:image:alt" content="GNFT" />
				<meta charSet="utf-8" />
				{/* <meta http-equiv="Content-Security-Policy" 
					content="
					default-src * data: mediastream: blob: filesystem: about: ws: wss: 'unsafe-eval' 'wasm-unsafe-eval' 'unsafe-inline'; 
					script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; 
					connect-src * data: blob: 'unsafe-inline'; 
					img-src * data: blob: 'unsafe-inline'; 
					frame-src * data: blob: ; 
					style-src * data: blob: 'unsafe-inline';
					font-src * data: blob: 'unsafe-inline';
					frame-ancestors * data: blob: 'unsafe-inline';"/> */}
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="../images/logoSolNFTss.ico" />
			</Head>
			<Provider store={myStore}>
				<Component {...pageProps} />
			</Provider>
		</>
	);
};

export default MyApp;