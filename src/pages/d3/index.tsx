import React from 'react';
import ParkDetailView from '@/components/ParkDetailView';
import { PHOTOS } from './photos';

const Page: React.FC = () => <ParkDetailView photos={PHOTOS} />;

export default Page;
