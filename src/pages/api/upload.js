import fs from 'fs';
import path from 'path';

// Disable the body parser for handling multipart data
export const config = {
  api: {
    bodyParser: false,  // Disabling the default body parser for handling raw body data
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // The raw body chunks will be collected here
  const chunks = [];

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    // Combine all chunks into one buffer
    const buffer = Buffer.concat(chunks);

    // Get boundary from the content-type header
    const boundary = req.headers['content-type'].split('boundary=')[1];
    
    // Find the boundary in the buffer
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    
    let start = 0;
    let end = buffer.indexOf(boundaryBuffer, start);

    let fileBuffer = null;
    let fileName = null;

    // Loop through parts and extract file content
    while (end !== -1) {
      start = end + boundaryBuffer.length;
      end = buffer.indexOf(boundaryBuffer, start);

      const part = buffer.slice(start, end === -1 ? buffer.length : end);

      // Check if the part contains file data (Content-Disposition: form-data; name="file")
      const contentDispositionIndex = part.indexOf('Content-Disposition: form-data; name="file"');
      if (contentDispositionIndex !== -1) {
        // Extract file content
        const fileData = part.slice(part.indexOf('\r\n\r\n') + 4); // Skip headers and get file data
        fileBuffer = fileData.slice(0, fileData.indexOf('\r\n--')); // Remove the trailing boundary

        fileName = `image-${Date.now()}.jpg`; // Generate a unique file name
      }
    }

    if (fileBuffer) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

      // Ensure the uploads folder exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      // Save the file to the server
      fs.writeFileSync(filePath, fileBuffer);

      // Send back the file URL in response
      res.status(200).json({ filename: fileName });
    } else {
      res.status(400).json({ message: 'No file found' });
    }
  });

  req.on('error', (err) => {
    res.status(500).json({ message: 'File upload failed', error: err.message });
  });
}

export default handler;
