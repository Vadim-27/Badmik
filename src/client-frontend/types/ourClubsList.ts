

export interface ClubFeatures {
  courts?: number;
  flooring?: string;
  parking?: boolean;
  water?: boolean;
  airConditioning?: boolean;
  trainingsRoom?: boolean;
  showers?: boolean;
  swimmingPool?: boolean;
  squashCenter?: boolean;
  groupClasses?: boolean;
  laserSpa?: boolean;
}


export interface Club {
  id: string;                
  name: string;              
  badge?: string;            
  city: string;              
  address: string;           
  description: string;       
  features: ClubFeatures;    
  priceFrom: number;         
  currency: string;         
  image: string;            
  detailsUrl: string;        
}

export interface ClubsList {
  clubs: Club[];
}
