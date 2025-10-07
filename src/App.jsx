import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendMessage, setBackendMessage] = useState("");

  const fetchBackendMessage = async () => {
    try {
      // '/api/message' 엔드포인트로 GET 요청을 보냅니다.
      const response = await fetch('/api/message');
      const data = await response.json(); //Json 형태로 ㅇㅇ
      
      // 받아온 데이터에서 message 값을 state에 저장
      setBackendMessage(data.message);
    } catch (error) {
      console.error("백엔드 데이터 요청 실패:", error);
      setBackendMessage("데이터를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchBackendMessage();
  }, []); // 두 번째 인자인 배열이 비어있으면 최초 1회만 실행


  return (
    <>
      <div>
        <h1>Hello World</h1>
        <hr />

        <h2>백엔드로부터 받은 메시지:</h2>
        {/* backendMessage state에 따라 다른 내용을 보여줍니다. */}

        <p style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          {backendMessage ? backendMessage : "로딩 중..."}
        </p>
        
    </div>
    </>
  )
}

export default App
