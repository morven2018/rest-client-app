export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(reader.result ? JSON.stringify(reader.result) : '');
    reader.onerror = () =>
      reject(new Error('Failed to convert file to Base64'));
  });
};
