

const Home = () => {

    function toggleSidebar() {
        const sidebar = document.querySelector('.w-64');
        sidebar.classList.toggle('w-20');  // Toggle the sidebar width
      }

  return (

<>
<div class="min-h-screen flex">
  <div class="w-64 bg-gray-800 text-white fixed h-full">
    <div class="flex justify-between items-center p-4">
      <h2 class="text-xl">Logo</h2>
      <button class="text-white" onclick={toggleSidebar} >☰</button>
    </div>
    <nav class="mt-6">
      <ul>
        <li><a href="#" class="block px-4 py-2">Dashboard</a></li>
        <li><a href="#" class="block px-4 py-2">Customer Relations</a></li>
        <li><a href="#" class="block px-4 py-2">General Management</a></li>
        <li><a href="#" class="block px-4 py-2">Janitorial</a></li>
        <li><a href="#" class="block px-4 py-2">Security Services</a></li>
      </ul>
    </nav>
  </div>

  <div class="flex-1 ml-64">
    <div class="bg-gray-800 text-white p-4 fixed w-full top-0 left-0 z-10">
      <div class="flex justify-between">
        <div class="text-xl">Admin Panel</div>
        <div class="flex items-center space-x-4">
          <button class="text-white">Notifications</button>
          <button class="text-white">Profile</button>
        </div>
      </div>
    </div>

    <div class="pt-20 p-4">
      <h2 class="text-2xl h-screen">Dashboard Content</h2>
      <p class="mt-4">Your content goes here...</p>
    </div>
  </div>
</div>


</>
  );
};

export default Home;
