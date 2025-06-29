import EducationCard from './education'
import EmploymentCard from './employement'
import FamilyInfoCard from './family'

const BeneficiaryDetailsTab = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <EducationCard />
      <EmploymentCard />
      <FamilyInfoCard />
    </div>
  )
}

export default BeneficiaryDetailsTab
