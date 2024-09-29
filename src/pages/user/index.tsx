import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../infrastructures/firebase';
import PublicUser from '../../schema/public-user';

const User = () => {
    const { uid } = useParams();
    const [error, setError] = useState<string>('');
    const [userData, setUserData] = useState<PublicUser | null>();

    useEffect(() => {
        if (!uid) {
            return;
        }
        const fetchUserData = async () => {
            const docRef = doc(db, 'public/v1/users', uid);
            const userDoc = await getDoc(docRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                const res: PublicUser = 
                {
                    bio: data.bio,
                    blockCount: data.blockCount,
                    ethAddress: data.ethAddress,
                    followerCount: data.followerCount,
                    followingCount: data.followingCount,
                    isNFTicon: data.isNFTicon,
                    isOfficial: data.isOfficial,
                    isSuspended: data.isSuspended,
                    muteCount: data.muteCount,
                    postCount: data.postCount,
                    reportCount: data.reportCount,
                    uid: data.uid,
                    image: data.image,
                    userName: data.userName,
                };
                setUserData(res);
            } else {
                setError('ユーザーが存在しません');
            }
        };

        fetchUserData();
    }, [uid]);
    if (error) {
        return <h3>{error}</h3>
    }
    return (
        <div>
            <h3>ユーザー名: {userData?.userName.value ?? ''}</h3>
            <p>自己紹介: {userData?.bio.value ?? ''}</p>
            <p>フォロワー数: {userData?.followerCount ?? 0}</p>
            <p>フォロー数: {userData?.followingCount ?? 0}</p>
        </div>
    );
};

export default User;