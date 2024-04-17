import {Mock} from '../utils/Mock';

type CompanyData = {
  companyId?: number;
  companyName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  admin?: string;
};
export const getCompanyData = () => {
  const companyDataList = Mock.companyList;
  return companyDataList;
};
