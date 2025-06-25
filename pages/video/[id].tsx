import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

const PlyrVideo = dynamic(() => import('../../components/PlyrVideo'), {
  ssr: false, 
});

const Awusahrul_HalamanPemutarVideo = () => {
  const awusahrul_router = useRouter();
  const { id: awusahrul_id_dari_url } = awusahrul_router.query;
  
  const [awusahrul_pesan_error, awusahrul_atur_pesan_error] = useState<string | null>(null);

  useEffect(() => {
    if (awusahrul_router.isReady && !awusahrul_id_dari_url) {
      awusahrul_atur_pesan_error('ID file tidak ditemukan di URL.');
    }
  }, [awusahrul_router.isReady, awusahrul_id_dari_url]);

  if (!awusahrul_router.isReady) {
    return null;
  }

  if (awusahrul_pesan_error) {
    return (
      <div style={awusahrul_gaya_kontainer_error}>
        <p style={awusahrul_gaya_teks_error}>{awusahrul_pesan_error}</p>
      </div>
    );
  }

  if (awusahrul_id_dari_url && typeof awusahrul_id_dari_url === 'string') {
    const awusahrul_url_thumbnail = `https://lh3.googleusercontent.com/d/${awusahrul_id_dari_url}`;

    return (
      <>
        <Head>
          <title>Pemutar Video</title>
        </Head>
        <div style={awusahrul_gaya_kontainer_video}>
          <PlyrVideo 
            awusahrul_sumber_video={`/api/src/${awusahrul_id_dari_url}`} 
            awusahrul_poster_url={awusahrul_url_thumbnail} 
            awusahrul_saat_video_error={() => awusahrul_atur_pesan_error('Gagal memutar video. Pastikan ID file benar dan file dapat diakses.')}
          />
        </div>
      </>
    );
  }
  
  return null;
};

const awusahrul_gaya_kontainer_video: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#000',
};

const awusahrul_gaya_kontainer_error: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#111',
};

const awusahrul_gaya_teks_error: React.CSSProperties = {
  color: '#fff',
  fontFamily: 'sans-serif',
  fontSize: '1.2rem',
  padding: '20px',
  textAlign: 'center',
};

export default Awusahrul_HalamanPemutarVideo;
