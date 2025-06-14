
import Navigation from "@/components/ui/navigation";
import RoleBasedActions from "@/components/RoleBasedActions";
import { useAuth } from "@/contexts/AuthContext";
import { useAutoSeed } from "@/hooks/useAutoSeed";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const { isSeeding, isSeeded } = useAutoSeed();

  if (loading || isSeeding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Loading...' : 'Setting up your community dashboard...'}
          </p>
        </div>
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
          {isSeeded && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Platform ready with sample data
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <RoleBasedActions />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              🤝 How it Works
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">For Community Members:</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    Submit help requests when you need assistance
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    Browse available tasks to help others
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    Earn badges for your contributions
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">For {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}s:</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {profile?.role === 'coordinator' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Review and verify submitted tasks
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Manage community volunteer efforts
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Access comprehensive admin dashboard
                      </li>
                    </>
                  )}
                  {profile?.role === 'scout' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Identify community needs through field work
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Perform wellness checks on residents
                      </li> 
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Submit detailed field assessments
                      </li>
                    </>
                  )}
                  {(profile?.role === 'volunteer' || !profile?.role) && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Claim and complete community tasks
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Help neighbors with various needs
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Build stronger community connections
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
