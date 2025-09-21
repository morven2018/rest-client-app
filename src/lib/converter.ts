export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        const commaIndex = reader.result.indexOf(',');
        if (commaIndex !== -1) {
          resolve(reader.result.slice(commaIndex + 1));
        } else {
          resolve('');
        }
      } else {
        resolve('');
      }
    };

    reader.onerror = () =>
      reject(new Error('Failed to convert file to Base64'));
    reader.onabort = () => reject(new Error('File reading was aborted'));

    reader.readAsDataURL(file);
  });
};
