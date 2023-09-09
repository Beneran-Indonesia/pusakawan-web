import axios from 'axios';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function UserHome({ userData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    
    return (
        <p>{JSON.stringify(userData)}</p>
    )
}

type UserDatas = {
    userData: string;
}

export const getServerSideProps: GetServerSideProps<UserDatas> = async () => {
    const res = await axios.get(process.env.API_URL + '/user/my-profile');
    console.log(res);
    if (res.status === 200) {
        return { props: { userData: res.data } };
    }
    return { props: { userData: "Cannot process your request at the moment." } };
}
