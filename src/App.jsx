import { useState, useMemo } from 'react'

const COMMON_WORDS = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'being', 'has', 'had', 'does', 'did', 'doing', 'eat', 'mate', 'team', 'meat', 'rate', 'tear', 'stem', 'met', 'set', 'let', 'pet', 'net', 'get', 'yet', 'bet', 'wet', 'jet', 'run', 'sun', 'fun', 'bun', 'gun', 'cut', 'put', 'but', 'hut', 'nut', 'sit', 'bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'wit', 'big', 'dig', 'fig', 'gig', 'jig', 'pig', 'rig', 'wig', 'bag', 'gag', 'hag', 'jag', 'lag', 'nag', 'rag', 'sag', 'tag', 'wag', 'bad', 'dad', 'fad', 'gad', 'had', 'lad', 'mad', 'pad', 'sad', 'tad', 'bed', 'fed', 'led', 'red', 'wed', 'big', 'bug', 'dug', 'hug', 'jug', 'lug', 'mug', 'pug', 'rug', 'tug', 'ban', 'can', 'dan', 'fan', 'man', 'pan', 'ran', 'tan', 'van', 'ben', 'den', 'hen', 'ken', 'men', 'pen', 'ten', 'yen', 'bin', 'din', 'fin', 'gin', 'kin', 'pin', 'sin', 'tin', 'win', 'boa', 'box', 'boy', 'bus', 'buy', 'car', 'cat', 'cow', 'cry', 'cut', 'dog', 'dry', 'dye', 'ear', 'eat', 'egg', 'end', 'eye', 'far', 'fat', 'few', 'fly', 'fox', 'gas', 'gay', 'god', 'got', 'gum', 'gut', 'guy', 'had', 'hat', 'hay', 'her', 'hid', 'him', 'hip', 'his', 'hit', 'hot', 'how', 'ice', 'ill', 'jam', 'jar', 'jaw', 'job', 'joy', 'key', 'lab', 'lap', 'law', 'lay', 'leg', 'lie', 'log', 'lot', 'low', 'mad', 'map', 'may', 'men', 'mix', 'mom', 'mud', 'net', 'new', 'nor', 'not', 'now', 'oak', 'odd', 'off', 'old', 'our', 'out', 'own', 'pay', 'pea', 'per', 'pig', 'pop', 'pot', 'put', 'raw', 'red', 'rid', 'rob', 'rod', 'row', 'rub', 'rue', 'run', 'sad', 'sat', 'saw', 'say', 'sea', 'see', 'set', 'sex', 'she', 'shy', 'sin', 'sit', 'six', 'sky', 'son', 'sub', 'sum', 'sun', 'tax', 'tea', 'ten', 'the', 'tie', 'too', 'top', 'toy', 'try', 'two', 'use', 'van', 'war', 'was', 'way', 'wet', 'who', 'why', 'wig', 'win', 'won', 'yes', 'yet', 'you', 'zoo'];

function charFrequency(str) {
  const freq = {};
  for (const char of str.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

function canFormWord(word, inputFreq) {
  const wordFreq = charFrequency(word);
  for (const char in wordFreq) {
    if ((inputFreq[char] || 0) < wordFreq[char]) {
      return false;
    }
  }
  return true;
}

export default function App() {
  const [input, setInput] = useState('');
  const [filterLength, setFilterLength] = useState('all');
  const [sortBy, setSortBy] = useState('frequency');
  const [selectedWord, setSelectedWord] = useState(null);
  const [definition, setDefinition] = useState('');
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    
    const freq = charFrequency(input);
    const words = COMMON_WORDS.filter(word => canFormWord(word, freq));
    
    let filtered = filterLength === 'all' 
      ? words 
      : words.filter(w => w.length === parseInt(filterLength));
    
    if (sortBy === 'alphabetical') {
      filtered.sort();
    } else if (sortBy === 'length') {
      filtered.sort((a, b) => a.length - b.length);
    }
    // frequency is default (already sorted)
    
    return filtered;
  }, [input, filterLength, sortBy]);

  const fetchDefinition = async (word) => {
    setSelectedWord(word);
    setLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (res.ok) {
        const data = await res.json();
        setDefinition(data[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'No definition found');
      } else {
        setDefinition('Definition not found');
      }
    } catch {
      setDefinition('Could not fetch definition');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-500">Word Unscrambler</h1>
        <p className="text-center text-gray-400 mb-8">Find all words from your scrambled letters</p>
        
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Enter scrambled letters..."
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={filterLength}
              onChange={(e) => setFilterLength(e.target.value)}
              className="bg-slate-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All lengths</option>
              {[3,4,5,6,7,8,9,10].map(len => <option key={len} value={len}>{len} letters</option>)}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="frequency">By Frequency</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="length">By Length</option>
            </select>
          </div>
          
          <button
            onClick={() => { setInput(''); setSelectedWord(null); setDefinition(''); }}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Clear
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Words Found: {results.length}</h2>
            <div className="bg-slate-900 p-4 rounded-lg max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">Enter letters to find words</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {results.map(word => (
                    <button
                      key={word}
                      onClick={() => fetchDefinition(word)}
                      className={`p-2 rounded text-center transition text-sm ${selectedWord === word ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                    >
                      {word} ({word.length})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-slate-900 p-4 rounded-lg h-fit">
            <h3 className="text-lg font-bold mb-3">Definition</h3>
            {selectedWord ? (
              <div>
                <p className="text-blue-400 font-bold mb-2">{selectedWord.toUpperCase()}</p>
                {loading ? <p className="text-sm text-gray-400">Loading...</p> : <p className="text-sm text-gray-300">{definition}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click a word to see its definition</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
