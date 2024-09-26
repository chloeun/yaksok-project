declare namespace naver.maps {
  class Map {
    constructor(el: HTMLElement | string, options: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setZoom(zoomLevel: number): void;
    panTo(latlng: naver.maps.LatLng | naver.maps.Point): void;
    fitBounds(bounds: Bounds | BoundsLiteral | ArrayOfCoords | ArrayOfCoordsLiteral, options?: FitBoundsOptions): void; 
  }

  interface SearchResultItem {
    name: string;
    address: string;
    latlng: naver.maps.LatLng;
    distance?: number; // Optional distance property to store the calculated distance
  }
  
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
  }

  interface GeocodeOptions {
    query: string;
  }

  interface GeocodeResponse {
    v2: {
      addresses: Array<{
        roadAddress: string;
        x: string;
        y: string;
      }>;
    };
  }

  interface Service {
    geocode(options: GeocodeOptions, callback: (status: ServiceStatus, response: GeocodeResponse) => void): void;
  }

  type ServiceStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

  const Service: {
    geocode: (options: GeocodeOptions, callback: (status: ServiceStatus, response: GeocodeResponse) => void) => void;
    Status: {
      OK: 'OK';
      ZERO_RESULT: 'ZERO_RESULT';
      ERROR: 'ERROR';
    };
  };
}
