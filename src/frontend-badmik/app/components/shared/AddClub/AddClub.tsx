const AddClub = () => {
  return (
    <section className="mb-10">
          <h2 className=" font-geist-sans text-2xl font-semibold mb-4">1. Додати зал</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Назва залу"
              className="border p-3 rounded-md"
            />
            <input
              type="number"
              placeholder="Кількість кортів"
              className="border p-3 rounded-md"
            />
            <input
              type="text"
              placeholder="Місто"
              className="border p-3 rounded-md md:col-span-2"
            />
            <input
              type="text"
              placeholder="Адреса"
              className="border p-3 rounded-md md:col-span-2"
            />
            <button
              type="submit"
              className="bg-secondary-button text-white py-2 rounded-md md:col-span-2 hover:bg-secondary-button-hover focus:bg-secondary-button-focus"
            >
              Створити зал
            </button>
          </form>
        </section>
    );
}

export default AddClub;