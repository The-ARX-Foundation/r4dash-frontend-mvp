
import Navigation from "@/components/ui/navigation";
import Sample-DataCreator from "@/components/SampleDataCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to role selection if user doesn't have a role set
  if (!profile?.role || profile.role === 'volunteer') {
    return <Navigate to="/role-selection" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Community Helper
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Connect neighbors in need with those who can help
          </p>
          <p className="text-lg text-indigo-600 font-medium">
            Role: {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                🤝 How it Works
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Community members submit help requests
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Volunteers claim and complete tasks
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Coordinators verify completed work
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Everyone earns badges for their contributions
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                📊 Sample Data
              </h2>
              <p className="text-gray-600 mb-4">
                Get started by adding sample tasks and badges to explore the platform.
              </p>
              <SampleDataCreator />
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
