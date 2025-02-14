import { useState } from "react";
import logo from "../../assets/img/logo.png";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Header = ({ user, room }) => {
  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EduCheck</span>
        </a>

        <nav className="flex space-x-6 text-lg">
          <a href="/dashboard" className="text-primary hover:text-secondary transition">Home</a>
          {user.isStaff && (
            <>
              <a href={`/create_test/${room.id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-folder-plus"></i> Create Test
              </a>
              <a href={`/update_class/${room.id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-gear"></i> Modify Classroom
              </a>
            </>
          )}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-primary hover:text-secondary transition">
              <span>{user.firstName}</span>
              <i className="bi bi-person-circle"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-lg p-3 right-0 mt-2 rounded-lg text-sm w-40">
              <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</a></li>
              <li><a href="/logout" className="block px-4 py-2 hover:bg-gray-200">Logout</a></li>
              <li className="px-4 py-2">Class Code: {room.code}</li>
              <li><a href={`/people/${room.id}`} className="block px-4 py-2 hover:bg-gray-200">People</a></li>
              {user.isStaff && (
                <li>
                  <a href={`/delete_class/${room.id}`} className="block px-4 py-2 text-red-600 hover:bg-red-100">
                    Delete {room.name} <i className="bi bi-trash"></i>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

const SortableItem = ({ item, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-6 bg-white shadow-md rounded-lg flex flex-col gap-2 border-l-4 border-blue-500">
      <h2 className="text-xl font-semibold text-gray-800">
        {item.status === "late" || item.status === "not" ? (
          <span>{index + 1}. {item.name}</span>
        ) : (
          <a href={`/attend_test/${item.id}`} className="text-primary hover:text-secondary transition">
            {index + 1}. {item.name}
          </a>
        )}
      </h2>
      <p className="text-gray-600 mt-2">{item.desc}</p>
      <p className={`mt-2 font-semibold ${item.status === "Assigned" ? "text-green-500" : item.status === "late" ? "text-red-500" : item.status === "not" ? "text-yellow-500" : "text-gray-700"}`}>{item.status}</p>
      <div className="text-sm text-gray-500 mt-2">
        {item.startTime && <p><i className="bi bi-alarm"></i> Start time: {item.startTime}</p>}
        {item.endTime && <p><i className="bi bi-clock-history"></i> End time: {item.endTime}</p>}
      </div>
      <span className="cursor-move text-gray-500 self-end">☰ Drag</span>
    </article>
  );
};

const TestsList = ({ tests, setTests }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTests((tests) => {
        const oldIndex = tests.findIndex((t) => t.id === active.id);
        const newIndex = tests.findIndex((t) => t.id === over.id);
        return arrayMove(tests, oldIndex, newIndex);
      });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Tests</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tests} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {tests.map((t, index) => (
                <SortableItem key={t.id} item={t} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
};

const App = () => {
  const [user] = useState({ isStaff: true, firstName: "John" });
  const [room] = useState({ id: 1, name: "Math Class", code: "ABC123" });
  const [tests, setTests] = useState([
    { id: "1", name: "Algebra Test", desc: "Algebra basics", status: "Assigned", startTime: "10:00 AM", endTime: "11:00 AM" },
    { id: "2", name: "Geometry Test", desc: "Shapes and angles", status: "done", startTime: "1:00 PM", endTime: "2:00 PM" }
  ]);

  return (
    <div className="font-sans text-gray-900">
      <Header user={user} room={room} />
      <main className="pt-24">
        <TestsList tests={tests} setTests={setTests} />
      </main>
    </div>
  );
};

export default App;