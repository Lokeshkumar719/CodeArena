import { Plus, Edit, Trash2, Video, ArrowRight } from "lucide-react";

import { NavLink } from "react-router";

function Admin() {
  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description:
        "Add new coding problems, test cases and starter templates to the platform.",
      icon: Plus,
      color: "btn-success",
      bgColor: "bg-success/10",
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description:
        "Edit existing problems, modify solutions and manage problem details.",
      icon: Edit,
      color: "btn-warning",
      bgColor: "bg-warning/10",
      route: "/admin/update-list",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description:
        "Remove outdated or invalid coding problems from the platform.",
      icon: Trash2,
      color: "btn-error",
      bgColor: "bg-error/10",
      route: "/admin/delete",
    },
    {
      id: "video",
      title: "Video Problem",
      description: "Upload and manage editorial videos for coding problems.",
      icon: Video,
      color: "btn-info",
      bgColor: "bg-info/10",
      route: "/admin/video",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Admin Dashboard
          </h1>

          <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Manage coding problems, editorial videos and platform content from
            one central dashboard.
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;

            return (
              <div
                key={option.id}
                className="group relative overflow-hidden rounded-3xl bg-base-100 border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                <div className="card-body items-center text-center p-10 relative z-10">
                  {/* Icon */}
                  <div
                    className={`${option.bgColor} p-5 rounded-2xl mb-6 transition-transform duration-500 group-hover:scale-110`}
                  >
                    <IconComponent size={36} className="text-base-content" />
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-2xl font-bold mb-3">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="text-base-content/70 mb-8 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Button */}
                  <NavLink
                    to={option.route}
                    className={`btn ${option.color} btn-wide group-hover:scale-105 transition-transform duration-300`}
                  >
                    {option.title}

                    <ArrowRight size={18} />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
