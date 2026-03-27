const ImageKit =require('imagekit')

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY, // This is the default and can be omitted
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // ✅ Correctly accessed
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT    
});

async function uploadFile(file,fileName) {
    const result=await imagekit.upload({
        file: file,
        fileName: fileName
    });
    console.log(result.url)
    return result.url; 
}

module.exports = { uploadFile }
