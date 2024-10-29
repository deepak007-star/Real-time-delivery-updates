import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl'; 

export default defineConfig({
  server: {
    https: {
      key: '../server/key.pem',  
      cert: '../server/cert.pem' 
    },
    cors: true, 
  },
  plugins: [basicSsl()]  
});
