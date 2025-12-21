
export default function Form() {
  return (
    <form className="w-full max-w-md">
      <div className="grid grid-cols-1">
        <div className="col-span-full">
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Nome
          </label>
          <div className="mt-2">
            <input
              id="name"
              type="text"
              name="name"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              required
            />
          </div>
        </div>
        <div className="col-span-full">
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              type="email"
              name="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              required
            />
          </div>
        </div>
        <div className="col-span-full">
          <label
            htmlFor="about"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Deixe sua mensagem
          </label>
          <div className="mt-2">
            <textarea
              id="about"
              name="about"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              required
            ></textarea>
          </div>
          {/* <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p> */}
        </div>
        <button type="submit" className="w-full">Submeter</button>
      </div>
    </form>
  );
}
