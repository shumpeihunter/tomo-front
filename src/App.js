import './App.css';
import { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const FILE_SEARCH_STORE_ID = process.env.REACT_APP_FILE_SEARCH_STORE_ID || 'eibi';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError('質問を入力してください。');
      setAnswer('');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmed, id: FILE_SEARCH_STORE_ID }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'リクエストに失敗しました。');
      }

      setAnswer(data.answer || '');
    } catch (err) {
      setError(err.message || 'エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-shell">
        <header className="hero">
          <p className="eyebrow">ドキュメント検索</p>
          <h1>検索ストアから回答を返します。</h1>
          <p className="hero-copy">
            質問を入力すると、ファイル検索ストアから回答を表示します。
          </p>
        </header>

        <main className="stack">
          <section className="panel">
            <form onSubmit={handleSubmit} className="form">
              <label className="label" htmlFor="question">
                質問
              </label>
              <textarea
                id="question"
                className="textarea"
                placeholder="例: 営業の名簿を教えて"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={6}
              />
              <button className="button" type="submit" disabled={isLoading}>
                {isLoading ? '検索中...' : '送信'}
              </button>
              {error ? <p className="error">{error}</p> : null}
            </form>
          </section>

          <section className="panel">
            <div className="result-block">
              <p className="label">回答</p>
              <div className="result">
                {answer ? (
                  <pre>{answer}</pre>
                ) : (
                  <p className="placeholder">ここに回答が表示されます。</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
