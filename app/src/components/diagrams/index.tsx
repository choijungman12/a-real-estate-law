import type { LawCategory } from '@/lib/law/catalog';
import { RedevelopmentDiagram } from './RedevelopmentDiagram';
import { UrbanDevelopmentDiagram } from './UrbanDevelopmentDiagram';
import { FarmForestDiagram } from './FarmForestDiagram';
import { AuctionDiagram } from './AuctionDiagram';
import {
  MarketResearchDiagram,
  ValuationDiagram,
  SubscriptionDiagram,
  FinanceRegulationDiagram,
  MapPropertyDiagram,
  NewsDiagram,
  Voice3DDiagram,
  CollaborationDiagram,
  StudyDiagram,
} from './OtherDiagrams';

export function CategoryDiagram({ category }: { category: LawCategory }) {
  switch (category) {
    case 'market_research':
      return <MarketResearchDiagram />;
    case 'redevelopment':
      return <RedevelopmentDiagram />;
    case 'valuation':
      return <ValuationDiagram />;
    case 'auction':
      return <AuctionDiagram />;
    case 'subscription':
      return <SubscriptionDiagram />;
    case 'finance_regulation':
      return <FinanceRegulationDiagram />;
    case 'urban_development':
      return <UrbanDevelopmentDiagram />;
    case 'farm_forest':
      return <FarmForestDiagram />;
    case 'map_property':
      return <MapPropertyDiagram />;
    case 'news':
      return <NewsDiagram />;
    case 'voice_3d':
      return <Voice3DDiagram />;
    case 'collaboration':
      return <CollaborationDiagram />;
    case 'study':
      return <StudyDiagram />;
    default:
      return null;
  }
}
