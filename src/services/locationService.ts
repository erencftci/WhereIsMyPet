interface Location {
  id: number;
  name: string;
}

interface City extends Location {
  districts: District[];
}

interface District extends Location {
  neighborhoods: Neighborhood[];
}

interface Neighborhood extends Location {}

const API_BASE_URL = 'https://turkiyeapi.dev/api/v1';

export const locationService = {
  async getCities(): Promise<City[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/provinces`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Cities Response:', data);
      if (!data || !data.data) {
        console.error('Invalid cities data structure:', data);
        return [];
      }
      return data.data.map((city: any) => ({
        id: city.id,
        name: city.name
      }));
    } catch (error) {
      console.error('İller yüklenirken hata oluştu:', error);
      return [];
    }
  },

  async getDistricts(cityId: number): Promise<District[]> {
    try {
      // Önce ilin detaylarını alıyoruz
      const cityResponse = await fetch(`${API_BASE_URL}/provinces/${cityId}`);
      if (!cityResponse.ok) {
        throw new Error(`HTTP error! status: ${cityResponse.status}`);
      }
      const cityData = await cityResponse.json();
      console.log('API City Details Response:', cityData);

      if (!cityData || !cityData.data || !cityData.data.districts) {
        console.error('Invalid city details data structure:', cityData);
        return [];
      }

      // İlçeleri ilin detaylarından alıyoruz
      return cityData.data.districts.map((district: any) => ({
        id: district.id,
        name: district.name
      }));
    } catch (error) {
      console.error('İlçeler yüklenirken hata oluştu:', error);
      return [];
    }
  },

  async getNeighborhoods(districtId: number): Promise<Neighborhood[]> {
    try {
      // Önce ilçenin detaylarını alıyoruz
      const districtResponse = await fetch(`${API_BASE_URL}/districts/${districtId}`);
      if (!districtResponse.ok) {
        throw new Error(`HTTP error! status: ${districtResponse.status}`);
      }
      const districtData = await districtResponse.json();
      console.log('API District Details Response:', districtData);

      if (!districtData || !districtData.data || !districtData.data.neighborhoods) {
        console.error('Invalid district details data structure:', districtData);
        return [];
      }

      // Mahalleleri ilçenin detaylarından alıyoruz
      return districtData.data.neighborhoods.map((neighborhood: any) => ({
        id: neighborhood.id,
        name: neighborhood.name
      }));
    } catch (error) {
      console.error('Mahalleler yüklenirken hata oluştu:', error);
      return [];
    }
  }
}; 