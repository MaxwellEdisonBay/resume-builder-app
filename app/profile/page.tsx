"use client";

import ServerSeparator from "@components/ServerSeparator";
import { IUser } from "@models/domain/IUser";
import { BaseErrorResponse } from "@models/dto/error";
import { showToast } from "@utils/toast";
import { useEffect, useState } from "react";
import { ProfileForm, ProfileFormValues } from "./profile-form";

export default function SettingsProfilePage() {
  const [profileData, setProfileData] = useState<IUser | undefined>();
  const [error, setError] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false)

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch(`api/profile`);
        if (response.ok) {
          const fetchedProfileData: IUser = await response.json();
          console.log(fetchedProfileData);
          setProfileData(fetchedProfileData);
        } else {
          const error: BaseErrorResponse = await response.json();
          showToast({ message: error.message, type: "error" });
          setError(true);
        }
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Exception occurred while fetching profile data.";
        showToast({ message, type: "error" });
      }
    };
    fetchUserProfileData();
  }, []);

  // const hasEmptyFields = profileData && !Object.entries(profileData).every((r) => !!r)
  // console.log(profileData)
  // console.log({hasEmptyFields})

  const handleUpdate = async (data: ProfileFormValues) => {
    try {
      setUpdatingProfile(true)
      const invalidateRs = await fetch(`/api/resumes/invalidate`, {
        // body: JSON.stringify(data),
        method: "POST",
      });
      const invalidateRsJson = await invalidateRs.json()
      console.log({invalidateRsJson})
      const response = await fetch(`/api/profile`, {
        body: JSON.stringify(data),
        method: "POST",
      });
      if (response.ok) {
        const updatedProfileData: IUser = await response.json();
        console.log({ updatedProfileData });
        setProfileData(updatedProfileData);
        showToast({
          message: "Profile data was updated successfully.",
          type: "success",
        });
      } else {
        const error: BaseErrorResponse = await response.json();
        showToast({ message: error.message, type: "error" });
        setError(true);
      }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while fetching profile data.";
      showToast({ message, type: "error" });
    } finally {
      setUpdatingProfile(false)
    }
  };

  const handleTryAgain = async () => {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <ServerSeparator />

      <ProfileForm loading={updatingProfile} profileData={profileData} onUpdate={handleUpdate} />
 
    </div>
  );
}
