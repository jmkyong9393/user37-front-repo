import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. 프론트엔드에서 '/api' 로 시작하는 모든 요청을 가로챕니다.
      '/api': {
        // 2. 가로챈 요청을 백엔드 주소인 8080 포트로 몰래 던집니다.
        target: 'http://localhost:8080',
        
        // 3. 백엔드 입장에서는 요청이 localhost:5173이 아니라, 자기 자신(8080)에게서 온 것처럼 착각하게 만듭니다. (CORS 에러 원천 차단)
        changeOrigin: true,
        
        // 4. [매우 중요!] 경로 재작성 규칙
        // 만약 스프링 부트 컨트롤러가 @RequestMapping("/api/users") 처럼 '/api'를 포함하고 있다면 아래 줄은 주석 처리하세요.
        // 만약 스프링 부트 컨트롤러가 @RequestMapping("/users") 처럼 '/api'가 없다면 주석을 해제하여 '/api'라는 글자를 지우고 보내야 합니다.
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})