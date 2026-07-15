import { useState, useMemo, useCallback } from 'react'

const COMMON_WORDS = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'being', 'has', 'had', 'does', 'did', 'doing', 'eat', 'mate', 'team', 'meat', 'rate', 'tear', 'stem', 'met', 'set', 'let', 'pet', 'net', 'get', 'yet', 'bet', 'wet', 'jet', 'run', 'sun', 'fun', 'bun', 'gun', 'cut', 'put', 'but', 'hut', 'nut', 'sit', 'bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'wit', 'big', 'dig', 'fig', 'gig', 'jig', 'pig', 'rig', 'wig', 'bag', 'gag', 'hag', 'jag', 'lag', 'nag', 'rag', 'sag', 'tag', 'wag', 'bad', 'dad', 'fad', 'gad', 'had', 'lad', 'mad', 'pad', 'sad', 'tad', 'bed', 'fed', 'led', 'red', 'wed', 'bug', 'dug', 'hug', 'jug', 'lug', 'mug', 'pug', 'rug', 'tug', 'ban', 'can', 'dan', 'fan', 'man', 'pan', 'ran', 'tan', 'van', 'ben', 'den', 'hen', 'ken', 'men', 'pen', 'ten', 'yen', 'bin', 'din', 'fin', 'gin', 'kin', 'pin', 'sin', 'tin', 'win', 'boa', 'box', 'boy', 'bus', 'buy', 'car', 'cat', 'cow', 'cry', 'dog', 'dry', 'dye', 'ear', 'egg', 'end', 'eye', 'far', 'fat', 'few', 'fly', 'fox', 'gas', 'gay', 'god', 'got', 'gum', 'gut', 'guy', 'hat', 'hay', 'hid', 'hip', 'hot', 'how', 'ice', 'ill', 'jam', 'jar', 'jaw', 'job', 'joy', 'key', 'lab', 'lap', 'law', 'lay', 'leg', 'lie', 'log', 'lot', 'low', 'map', 'may', 'mix', 'mom', 'mud', 'new', 'nor', 'oak', 'odd', 'off', 'old', 'own', 'pay', 'pea', 'per', 'pop', 'pot', 'raw', 'rid', 'rob', 'rod', 'row', 'rub', 'rue', 'sad', 'sat', 'saw', 'sea', 'sex', 'shy', 'six', 'sky', 'son', 'sub', 'sum', 'tax', 'tea', 'tie', 'too', 'top', 'toy', 'try', 'use', 'van', 'war', 'way', 'who', 'why', 'win', 'won', 'yes', 'you', 'zoo'];

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
      : words.filter(w => w.length.toString() === filterLength);
    
    if (sortBy === 'alphabetical') {
      filtered.sort();
    } else if (sortBy === 'length') {
      filtered.sort((a, b) => a.length - b.length);
    }
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top Banner AdSense */}
      {/* <div className="bg-slate-800 p-4 text-center text-gray-400 text-sm">
        Google AdSense Banner (728x90) - Replace this comment with ad code
      </div> */}
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Word Unscrambler
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            Enter scrambled letters and instantly find all possible words
          </p>
          <p className="text-sm text-gray-500">
            Perfect for Scrabble, Wordle, and word games
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Input Section */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 shadow-xl border border-slate-700">
              <input
                type="text"
                placeholder="Enter scrambled letters... (e.g., EATRM)"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="w-full bg-slate-700 text-white text-lg px-4 py-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                autoFocus
              />
              
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={filterLength}
                  onChange={(e) => setFilterLength(e.target.value)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All lengths</option>
                  {[3,4,5,6,7,8,9,10].map(len => <option key={len} value={len}>{len} letters</option>)}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="frequency">Most Common</option>
                  <option value="alphabetical">A - Z</option>
                  <option value="length">Shortest First</option>
                </select>
              </div>
              
              <button
                onClick={() => { setInput(''); setSelectedWord(null); setDefinition(''); }}
