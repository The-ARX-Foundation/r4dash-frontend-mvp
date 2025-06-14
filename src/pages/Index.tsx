
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, CheckCircle, Plus, Search, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/ui/navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Community Helper Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Help Your <span className="text-green-600">Community</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with neighbors, share tasks, and build stronger communities together. 
            Request help or offer assistance with just a few taps.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/create-task">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Request Help
              </Button>
            </Link>
            <Link to="/browse-tasks">
              <Button size="lg" variant="outline" className="px-8 py-3">
                <Search className="w-5 h-5 mr-2" />
                Help Others
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">1,200+</div>
              <div className="text-gray-600">Community Members</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">450+</div>
              <div className="text-gray-600">Tasks Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Submit a Task</CardTitle>
                <CardDescription>
                  Post what you need help with - from groceries to dog walking
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Get Matched</CardTitle>
                <CardDescription>
                  Neighbors volunteer to help with your request
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Task Complete</CardTitle>
                <CardDescription>
                  Helper completes the task and everyone benefits
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Recent Community Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completed
                  </Badge>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <CardTitle className="text-lg">Help elderly neighbor with groceries</CardTitle>
                <CardDescription>
                  Sarah helped Mrs. Johnson carry groceries up to her 3rd floor apartment
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    In Progress
                  </Badge>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <CardTitle className="text-lg">Walk rescue dogs</CardTitle>
                <CardDescription>
                  Mike is helping the local animal shelter with their daily dog walks
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-green-100 mb-6 max-w-md mx-auto">
              Join thousands of community members who are already helping each other every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-task">
                <Button size="lg" variant="secondary" className="px-8">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/browse-tasks">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Browse Available Tasks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Index;
