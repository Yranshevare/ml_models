import { useState } from 'react';
import { Car, TrendingUp, Loader2 } from 'lucide-react';
import { predictCarPrice } from '../services/api';
import '../styles/carPricePredictor.css';

interface CarData {
  year: number;
  km_driven: number;
  fuel: string;
  company: string;
}

const CarPricePrediction = () => {
  const [formData, setFormData] = useState<CarData>({
    year: new Date().getFullYear(),
    km_driven: 0,
    fuel: 'Petrol',
    company: '',
  });
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const companies = [
    'Hyundai', 'Maruti', 'Honda', 'Toyota', 'Ford',
    'Mahindra', 'Tata', 'Chevrolet', 'Renault', 'Nissan'
  ];
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const price = await predictCarPrice(formData);
      setPredictedPrice(price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to predict price');
      setPredictedPrice(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="predictor-container">
      <div className="predictor-content">
        <div className="predictor-header">
          <div className="icon-circle">
            <Car size={48} />
          </div>
          <h1 className="predictor-title">Car Price Predictor</h1>
          <p className="predictor-subtitle">
            Get an instant estimate of your car's value using AI-powered prediction
          </p>
        </div>

        <div className="predictor-card">
          <form onSubmit={handleSubmit} className="predictor-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="company" className="form-label">Car Company</label>
                <select
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label">Manufacturing Year</label>
                <input
                  type="number"
                  id="year"
                  required
                  min="1990"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="form-input"
                  placeholder="e.g., 2020"
                />
              </div>

              <div className="form-group">
                <label htmlFor="km_driven" className="form-label">Kilometers Driven</label>
                <input
                  type="number"
                  id="km_driven"
                  required
                  min="0"
                  value={formData.km_driven}
                  onChange={(e) => setFormData({ ...formData, km_driven: parseInt(e.target.value) })}
                  className="form-input"
                  placeholder="e.g., 15000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuel" className="form-label">Fuel Type</label>
                <select
                  id="fuel"
                  required
                  value={formData.fuel}
                  onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                  className="form-input"
                >
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  <span>Predict Price</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {predictedPrice !== null && !error && (
            <div className="result-card">
              <p className="result-label">Predicted Price</p>
              <p className="result-price">{formatPrice(predictedPrice)}</p>
              <p className="result-details">
                Based on {formData.year} {formData.company} with {formData.km_driven.toLocaleString()} km
              </p>
            </div>
          )}
        </div>

        <div className="predictor-footer">
          <p>Predictions are estimates based on machine learning models and market trends</p>
        </div>
      </div>
    </div>
  );
};

export default CarPricePrediction;
