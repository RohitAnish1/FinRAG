"use client"

import { useState } from "react"
import { useGoals } from "../hooks/useGoals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Calendar, Clock, PlusCircle } from "lucide-react"
import * as goalsApi from "../api/goals.api"
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
// Dummy modal, replace with your modal/dialog implementation
function AddGoalModal({ open, onClose, onAdd }: any) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    target_amount: "",
    current_amount: "",
    deadline: "",
    status: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await onAdd({
      ...form,
      target_amount: Number(form.target_amount),
      current_amount: Number(form.current_amount),
    })
    setLoading(false)
    onClose()
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-2">Add New Goal</h2>
        <input name="title" placeholder="Title" className="input" value={form.title} onChange={handleChange} required />
        <input name="category" placeholder="Category" className="input" value={form.category} onChange={handleChange} required />
        <input name="target_amount" type="number" placeholder="Target Amount" className="input" value={form.target_amount} onChange={handleChange} required />
        <input name="current_amount" type="number" placeholder="Current Amount" className="input" value={form.current_amount} onChange={handleChange} required />
        <input name="deadline" type="date" className="input" value={form.deadline} onChange={handleChange} />
        <select name="status" className="input" value={form.status} onChange={handleChange}>
          <option value="">Status</option>
          <option value="ahead">Ahead</option>
          <option value="on-track">On Track</option>
          <option value="behind">Behind</option>
        </select>
        <div className="flex gap-2 mt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Goal"}</Button>
        </div>
      </form>
    </div>
  )
}

export default function Goals() {
  const { user } = useAuth();
  const { goals, loading, refresh } = useGoals()
  const [showAdd, setShowAdd] = useState(false)

  // Add goal handler (implement createGoal in your API)
  async function handleAddGoal(goal: any) {
  await goalsApi.createGoal({
    title: goal.title,
    category: goal.category,
    targetAmount: Number(goal.target_amount),
    deadline: goal.deadline,
  });
  await refresh();
}

  // Enrich goals with progress and status
  const enrichedGoals = goals.map(g => {
    const progress = (g.current_amount / g.target_amount) * 100
    const status =
      g.status ||
      (progress >= 100 ? "ahead" :
        progress >= 50 ? "on-track" : "behind")
    return { ...g, progress, status }
  })

  const totalTarget = enrichedGoals.reduce((s, g) => s + (g.target_amount || 0), 0)
  const totalCurrent = enrichedGoals.reduce((s, g) => s + (g.current_amount || 0), 0)
  const onTrackCount = enrichedGoals.filter(g => g.status !== "behind").length

  return (
    <div className="min-h-screen bg-background">
    <Sidebar />
      <div className="lg:ml-64 p-4 lg:p-6">
        {/* Header and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Goals</h1>
          <Button onClick={() => setShowAdd(true)}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add Goal
          </Button>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Goals" value={enrichedGoals.length} />
          <StatCard title="On Track" value={onTrackCount} />
          <StatCard title="Total Target" value={`₹${totalTarget.toLocaleString()}`} />
          <StatCard
            title="Saved So Far"
            value={`₹${totalCurrent.toLocaleString()}`}
            badge={totalTarget > 0 ? `${((totalCurrent / totalTarget) * 100).toFixed(1)}%` : "0%"}
          />
        </div>

        {/* Empty state */}
        {!loading && enrichedGoals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
            <PlusCircle className="h-12 w-12 mb-4 text-blue-400" />
            <div className="text-lg mb-2">No goals yet</div>
            <div className="mb-4">Start by adding your first goal!</div>
            <Button onClick={() => setShowAdd(true)}>Add Goal</Button>
          </div>
        )}

        {/* Goals List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrichedGoals.map(goal => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <CardDescription>{goal.category}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      goal.status === "ahead"
                        ? "default"
                        : goal.status === "on-track"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {goal.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span><b>ID:</b> {goal.id}</span>
                  <span><b>User:</b> {goal.user_id}</span>
                  <span><b>Status:</b> {goal.status}</span>
                  <span><b>Category:</b> {goal.category}</span>
                  <span><b>Deadline:</b> {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "-"}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Current</div>
                    <div className="font-medium">₹{goal.current_amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Target</div>
                    <div className="font-medium">₹{goal.target_amount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Created: {goal.created_at ? new Date(goal.created_at).toLocaleString() : "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Updated: {goal.updated_at ? new Date(goal.updated_at).toLocaleString() : "-"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Goal
                  </Button>
                  <Button size="sm" className="flex-1">
                    Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <AddGoalModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddGoal} />
    </div>
  )
}

function StatCard({ title, value, badge }: any) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {badge && <Badge className="mt-2">{badge}</Badge>}
      </CardContent>
    </Card>
  )
}