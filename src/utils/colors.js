/**
 * Returns the color classes for a given event type
 * @param {string} type - The event type (sports, cultural, technical, workshop)
 * @returns {string} - Tailwind CSS color classes
 */
export const getTypeColor = (type) => {
  const colors = {
    sports: 'bg-green-50 text-green-700 border border-green-200',
    cultural: 'bg-purple-50 text-purple-700 border border-purple-200',
    technical: 'bg-blue-50 text-blue-700 border border-blue-200',
    workshop: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  };
  return colors[type] || 'bg-gray-50 text-gray-700 border border-gray-200';
};
