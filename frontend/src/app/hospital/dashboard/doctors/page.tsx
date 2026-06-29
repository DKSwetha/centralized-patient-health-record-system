"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import api from "@/lib/api";

interface Doctor {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
  };
  full_name: string;
  license_number: string;
  department: string;
  verified: boolean;
}

interface HospitalProfile {
  id: number;
  name: string;
  registration_number: string;
  address: string;
  contact_email: string;
  verified: boolean;
}

export default function HospitalDashboard() {
  return (
    <ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}>
      <HospitalDashboardContent />
    </ProtectedRoute>
  );
}

function HospitalDashboardContent() {
  const router = useRouter();
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalRes, doctorsRes] = await Promise.all([
          api.get("/hospitals/me/"),
          api.get("/hospitals/doctors/"),
        ]);
        setHospital(hospitalRes.data);
        setDoctors(doctorsRes.data);
      } catch (err: any) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {hospital?.name?.[0] ?? "H"}
            </span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {hospital?.name ?? "Hospital"}
            </h1>
            <p className="text-xs text-gray-500">Hospital Admin Dashboard</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            hospital?.verified
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hospital?.verified ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          {hospital?.verified ? "Verified" : "Pending verification"}
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Hospital info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Registration no." value={hospital?.registration_number ?? "—"} />
          <InfoCard label="Contact email" value={hospital?.contact_email ?? "—"} />
          <InfoCard label="Address" value={hospital?.address ?? "—"} />
        </div>

        {/* Doctors section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Doctors</h2>
              <p className="text-sm text-gray-500">
                {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered
              </p>
            </div>
            <button
              onClick={() => router.push("/hospital/dashboard/doctors/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span>+ Add doctor</span>
            </button>
          </div>

          {doctors.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
              <p className="text-sm font-medium text-gray-700">No doctors yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Add your first doctor to get started.
              </p>
              <button
                onClick={() => router.push("/hospital/dashboard/doctors/new")}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add doctor
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Department
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      License no.
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 text-xs font-semibold">
                              {doc.full_name?.[0] ?? doc.user.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          {doc.full_name || doc.user.username}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{doc.department}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {doc.license_number}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{doc.user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            doc.verified
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {doc.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
    </div>
  );
}