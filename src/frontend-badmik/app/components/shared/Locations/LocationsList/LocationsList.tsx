import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

const LocationsList = () => {
  return (
  <div>

    <ActionHeader>
      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded">
          🔄 Оновити
        </button>

        <h2 className="text-lg font-semibold">Локації</h2>

        <AddButton href="/admin/locations/add-location/" label="buttons.addLocation" />

    </ActionHeader>
    
    Locations List Component</div>
    );
}
export default LocationsList;