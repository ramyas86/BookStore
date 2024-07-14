import React from 'react';

function AlphabetFilter({ selectedLetter, onSelectLetter }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="alphabet-filter">
      {letters.map(letter => (
        <button
          key={letter}
          className={`alphabet-letter ${selectedLetter === letter ? 'active' : ''}`}
          onClick={() => onSelectLetter(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default AlphabetFilter;


