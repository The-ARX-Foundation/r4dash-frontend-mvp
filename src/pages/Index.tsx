
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Award, Plus, Search, CheckSquare, Shield, Map } from "lucide-react";
import { Link } from "react-router-dom";
import SampleDataCreator from "@/components/SampleDataCreator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Helper
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect neighbors, share tasks, build stronger communities
          </p>
        </div>

        {/* Sample Data Creator */}
        <div className="mb-8">
          <SampleDataCreator />
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-600" />
                Task Map
              </CardTitle>
              <CardDescription>
                Discover tasks near you on an interactive map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/map">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Map</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Browse Available Tasks
              </CardTitle>
              <CardDescription>
                Find tasks in your community that need help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/browse-tasks">
                <Button className="w-full">View Tasks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Create a New Task
              </CardTitle>
              <CardDescription>
                Post a task for others to help with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/create-task">
                <Button className="w-full" variant="outline">Post Task</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-orange-600" />
                Complete Tasks
              </CardTitle>
              <CardDescription>
                Work on tasks you've claimed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/complete-tasks">
                <Button className="w-full" variant="outline">My Tasks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Admin Queue
              </CardTitle>
              <CardDescription>
                Review and verify completed tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/tasks">
                <Button className="w-full" variant="outline">Admin Panel</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Connect with neighbors and build stronger community bonds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Complete tasks at your own pace and availability
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Earn Recognition</CardTitle>
              <CardDescription>
                Build your reputation and earn badges for helping others
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
