const formatName = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return name;
    return parts.map(part => part.charAt(0) + '%').join(' ');
  };
  
  module.exports = formatName;