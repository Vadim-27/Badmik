import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EmployeesTable from '@/app/components/shared/Employees/EmployeesTable/EmployeesTable';
import { getTranslations } from 'next-intl/server';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

const AccessPage = async ({
  params,
}: {
  params: { locale: string};
}) => {
  const {  locale } = await params;
  const t = await getTranslations({locale, namespace: 'ActionHeader.title'});
    return (
    <div className="p-4 w-full h-screen">
        <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">{t('employeeHeader')}</h2>
        <AddButton href={`/admin/access-control/add-employee`} label="buttons.addUser" />
        </ActionHeader>
        <EmployeesTable />
    </div>
);
}
export default AccessPage;