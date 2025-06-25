import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function awusahrul_penangan_permintaan(
  awusahrul_permintaan: NextApiRequest,
  awusahrul_respon: NextApiResponse
) {
  const { id: awusahrul_id_file } = awusahrul_permintaan.query;

  if (typeof awusahrul_id_file !== 'string' || !awusahrul_id_file) {
    return awusahrul_respon.status(400).json({ error: 'ID file dibutuhkan.' });
  }

  const awusahrul_kunci_api = process.env.GOOGLE_DRIVE_API_KEY || 'masukkan api disini jika env tidak bekerja';

  if (!awusahrul_kunci_api) {
    console.error('Kunci API Google Drive tidak dikonfigurasi.');
    return awusahrul_respon.status(500).json({ error: 'Error konfigurasi server.' });
  }

  const awusahrul_url_google_drive = `https://www.googleapis.com/drive/v3/files/${awusahrul_id_file}?alt=media&key=${awusahrul_kunci_api}`;

  try {
    const awusahrul_header_permintaan: HeadersInit = {};
    if (awusahrul_permintaan.headers.range) {
      awusahrul_header_permintaan['Range'] = awusahrul_permintaan.headers.range;
    }

    const awusahrul_respon_drive = await fetch(awusahrul_url_google_drive, {
      headers: awusahrul_header_permintaan,
    });

    if (!awusahrul_respon_drive.ok) {
      const awusahrul_data_error = await awusahrul_respon_drive.json();
      const awusahrul_pesan_error = awusahrul_data_error.error?.message || 'Gagal mengambil data dari Google Drive.';
      return awusahrul_respon.status(awusahrul_respon_drive.status).json({ error: awusahrul_pesan_error });
    }

    const awusahrul_header_untuk_disalin = [
      'content-type',
      'content-length',
      'accept-ranges',
      'content-range',
      'cache-control',
    ];

    awusahrul_header_untuk_disalin.forEach((awusahrul_nama_header) => {
      const awusahrul_nilai_header = awusahrul_respon_drive.headers.get(awusahrul_nama_header);
      if (awusahrul_nilai_header) {
        awusahrul_respon.setHeader(awusahrul_nama_header, awusahrul_nilai_header);
      }
    });
    
    awusahrul_respon.writeHead(awusahrul_respon_drive.status);

    if (awusahrul_respon_drive.body) {
      const awusahrul_pembaca_stream = awusahrul_respon_drive.body.getReader();
      
      while (true) {
        const { done: awusahrul_selesai, value: awusahrul_nilai_chunk } = await awusahrul_pembaca_stream.read();

        if (awusahrul_selesai) {
          break;
        }
        awusahrul_respon.write(awusahrul_nilai_chunk);
      }
      awusahrul_respon.end();
    } else {
      awusahrul_respon.end();
    }

  } catch (awusahrul_kesalahan_internal) {
    console.error('Error pada Proxy:', awusahrul_kesalahan_internal);
    awusahrul_respon.status(500).json({ error: 'Internal Server Error' });
  }
}
