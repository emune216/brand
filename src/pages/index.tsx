import { GetStaticProps, NextPage } from "next";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import { getPosts } from "./api/getPosts";
import { TPost } from "@/types";
import { Mesh } from "three";

const Home: NextPage<{ posts: TPost[] }> = ({ posts }: { posts: TPost[] }) => {
  return (
    <>
      <div className="flex w-fyll">
        <p className="w-full">YUNSU LIM</p>
      </div>
      <div className="mt-4 p-4 border rounded w-fit">
        <p className="border-b font-bold">POST TITLES</p>
        {posts.map(({ id, title }) => (
          <p key={id}>{title}</p>
        ))}
      </div>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60,
  };
};

export default Home;

function Box(props: any) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<Mesh>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    return (meshRef.current.rotation.x += delta);
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
