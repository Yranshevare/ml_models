interface CarData {
  year: number;
  km_driven: number;
  fuel: string;
  company: string;
}

export const predictCarPrice = async (carData: CarData): Promise<number> => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/predict';

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });

//   console.log(response)
  if (!response.ok) {
    throw new Error('Failed to predict car price. Please check your API endpoint.');
  }

  const data = await response.json();
//   console.log(typeof data.prediction);
  return data.prediction || data.price || 0;
};
