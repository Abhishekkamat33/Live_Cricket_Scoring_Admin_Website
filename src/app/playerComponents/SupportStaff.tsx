import React, { useState } from 'react';
import { FaUser, FaCamera, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { uploadImageToCloudinary } from '../utility/fetchImage';
import Image from 'next/image';

interface SupportingStaff {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  teamName: string;
}

const roles = ['Coach', 'Physio', 'Manager', 'Support'];

interface MatchData {
  teamA: { name: string; supportingStaff?: SupportingStaff[] };
  teamB: { name: string; supportingStaff?: SupportingStaff[] };
}

interface SupportStaffProps {
  matchData: MatchData;
  updateMatchData: (updatedData: Partial<MatchData>) => Promise<void>;
}



export default function SupportStaff({ matchData, updateMatchData }: SupportStaffProps) {
  // Form states
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState(roles[0]);
  const [staffImageFile, setStaffImageFile] = useState<File | null>(null);
  const [staffTeamName, setStaffTeamName] = useState(matchData.teamA.name);

  // Editing states
  const [staffEditingId, setStaffEditingId] = useState<string | null>(null);
  const [staffEditName, setStaffEditName] = useState('');
  const [staffEditRole, setStaffEditRole] = useState(roles[0]);
  const [staffEditImageFile, setStaffEditImageFile] = useState<File | null>(null);
  const [staffEditTeamName, setStaffEditTeamName] = useState('');

  // Render image or placeholder consistently
  const renderImage = (url?: string, alt?: string) =>
    url ? (
     <Image
     
           src={url}
           alt={alt ?? ''}
           width={56} // corresponds to w-14 in Tailwind (14*4px)
           height={56}
           className="rounded-full object-cover border-3 border-white shadow-lg"
         />
    ) : (
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 border-4 border-white shadow-lg">
        <FaUser size={20} />
      </div>
    );

  // Add new staff
  const addStaff = async () => {
    if (!staffName.trim()) {
      alert('Please enter staff member name');
      return;
    }
    if (!staffTeamName) {
      alert('Please select a team');
      return;
    }
    if (!matchData) return;

      const ImageFile = staffImageFile ? await uploadImageToCloudinary(staffImageFile) : '';

    const newStaff: SupportingStaff = {
      id: crypto.randomUUID(),
      name: staffName.trim(),
      role: staffRole,
      imageUrl: ImageFile || '', // Add your image upload logic here
      teamName: staffTeamName,
    };

    const updatedTeamAStaff =
      staffTeamName === matchData.teamA.name
        ? [...(matchData.teamA.supportingStaff ?? []), newStaff]
        : matchData.teamA.supportingStaff ?? [];

    const updatedTeamBStaff =
      staffTeamName === matchData.teamB.name
        ? [...(matchData.teamB.supportingStaff ?? []), newStaff]
        : matchData.teamB.supportingStaff ?? [];

    await updateMatchData({
      teamA: { ...matchData.teamA, supportingStaff: updatedTeamAStaff },
      teamB: { ...matchData.teamB, supportingStaff: updatedTeamBStaff },
    });

    setStaffName('');
    setStaffRole(roles[0]);
    setStaffImageFile(null);
  };

  // Start editing staff
  const startEditingStaff = (staff: SupportingStaff) => {
    setStaffEditingId(staff.id);
    setStaffEditName(staff.name);
    setStaffEditRole(staff.role);
    setStaffEditTeamName(staff.teamName);
    setStaffEditImageFile(null);
  };

  // Cancel editing
  const cancelEditingStaff = () => {
    setStaffEditingId(null);
    setStaffEditName('');
    setStaffEditRole(roles[0]);
    setStaffEditImageFile(null);
    setStaffEditTeamName('');
  };

  // Save edited staff
  const saveEditStaff = async () => {
    if (!staffEditName.trim() || !staffEditingId || !matchData || !staffEditTeamName) {
      alert('Invalid staff edit data');
      return;
    }

    const teamIsA = staffEditTeamName === matchData.teamA.name;
    const currentStaff = teamIsA ? matchData.teamA.supportingStaff ?? [] : matchData.teamB.supportingStaff ?? [];
    const ImageFile = staffEditImageFile ? await uploadImageToCloudinary(staffEditImageFile) : '';

  
    const updatedStaff = currentStaff.map((s) =>
      s.id === staffEditingId
        ? {
            ...s,
            name: staffEditName.trim(),
            role: staffEditRole,
            imageUrl:  ImageFile ? '' : s.imageUrl, // Add your image upload logic here
            teamName: staffEditTeamName,
          }
        : s
    );

    const updatedTeamAStaff = teamIsA ? updatedStaff : matchData.teamA.supportingStaff ?? [];
    const updatedTeamBStaff = !teamIsA ? updatedStaff : matchData.teamB.supportingStaff ?? [];

    await updateMatchData({
      teamA: { ...matchData.teamA, supportingStaff: updatedTeamAStaff },
      teamB: { ...matchData.teamB, supportingStaff: updatedTeamBStaff },
    });

    cancelEditingStaff();
  };

  // Delete staff member
  const deleteStaff = async (staffId: string) => {
    if (!matchData) return;
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    const isInTeamA = (matchData.teamA.supportingStaff ?? []).some((s) => s.id === staffId);

    const updatedTeamAStaff = isInTeamA
      ? (matchData.teamA.supportingStaff ?? []).filter((s) => s.id !== staffId)
      : matchData.teamA.supportingStaff ?? [];

    const updatedTeamBStaff = !isInTeamA
      ? (matchData.teamB.supportingStaff ?? []).filter((s) => s.id !== staffId)
      : matchData.teamB.supportingStaff ?? [];

    await updateMatchData({
      teamA: { ...matchData.teamA, supportingStaff: updatedTeamAStaff },
      teamB: { ...matchData.teamB, supportingStaff: updatedTeamBStaff },
    });
  };

  return (
   
    <>
      {/* Add Supporting Staff Form */}
       <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-2xl border border-green-200 mb-8">
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">Add Supporting Staff</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6 items-end">
          <input
            type="text"
            placeholder="Support Staff Name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-3 md:col-span-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
          />
          <select
            value={staffTeamName}
            onChange={(e) => setStaffTeamName(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
          >
            <option value={matchData.teamA.name}>{matchData.teamA.name}</option>
            <option value={matchData.teamB.name}>{matchData.teamB.name}</option>
          </select>
          <select
            value={staffRole}
            onChange={(e) => setStaffRole(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="relative md:col-span-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setStaffImageFile(e.target.files ? e.target.files[0] : null)}
              className="border-2 border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
            />
            <FaCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={addStaff}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl p-3 md:col-span-full md:col-start-8 transition transform hover:scale-105 shadow-lg font-semibold flex justify-center items-center"
          >
            <FaUser className="mr-2" /> Add Staff
          </button>
        </div>
      </section>
      </div>

    

    
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {[matchData.teamA, matchData.teamB].map((team , index) => (
           <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-green-200">
              <h3 className="text-xl font-semibold mb-6">{team.name} Staff</h3>
              {(team.supportingStaff?.length ?? 0) === 0 ? <p className="text-gray-500 italic">No supporting staff added.</p> : null}
              <ul className="space-y-4">
                {team.supportingStaff?.map((staff) => (
                  <li
                    key={staff.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    {renderImage(staff.imageUrl, staff.name)}

                    <div className="flex flex-col min-w-0 flex-grow">
                      {staffEditingId === staff.id ? (
                        <>
                          <input
                            type="text"
                            value={staffEditName}
                            onChange={(e) => setStaffEditName(e.target.value)}
                            className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Name"
                          />
                          <select
                            value={staffEditRole}
                            onChange={(e) => setStaffEditRole(e.target.value)}
                            className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <select
                            value={staffEditTeamName}
                            onChange={(e) => setStaffEditTeamName(e.target.value)}
                            className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value={matchData.teamA.name}>{matchData.teamA.name}</option>
                            <option value={matchData.teamB.name}>{matchData.teamB.name}</option>
                          </select>
                          <input
                            type="file"
                            accept="image/*"
                            className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2"
                            onChange={(e) => setStaffEditImageFile(e.target.files ? e.target.files[0] : null)}
                          />
                          <div className="flex space-x-4">
                            <button
                              onClick={saveEditStaff}
                              className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition flex-1"
                            >
                              <FaSave /> Save
                            </button>
                            <button
                              onClick={cancelEditingStaff}
                              className="bg-gray-400 text-white rounded-lg px-4 py-2 hover:bg-gray-500 transition flex-1"
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold truncate">{staff.name}</span>
                          <span className="text-gray-600 truncate">{staff.role}</span>
                        </>
                      )}
                    </div>

                    {staffEditingId !== staff.id && (
                      <div className="flex space-x-3 flex-shrink-0">
                        <button
                          onClick={() => startEditingStaff(staff)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-2 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteStaff(staff.id)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
     
  </>
  );
}
