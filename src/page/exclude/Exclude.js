import React, {Component} from "react";
import styles from "./exclude.module.scss";
import intl from "react-intl-universal";

export default class Exclude extends Component {
  gameList = {
    isb: [
      {name: "Lost Boys Loot", category: "Slot"},
      {name: "Egyptian King", category: "Slot"},
      {name: "Dragon Stone", category: "Slot"},
      {name: "Luxury Rome", category: "Slot"},
      {name: "Chilli Chilli Bang Bang", category: "Slot"},
      {name: "JesterTrio", category: "Slot"},
      {name: "Robo Smash", category: "Slot"},
      {name: "Slammin7s", category: "Slot"},
      {name: "Cloud Tales", category: "Slot"},
      {name: "Dolphin's Island", category: "Slot"},
      {name: "Fruit Boxes", category: "Slot"},
      {name: "Wisps", category: "Slot"},
      {name: "European Roulette Silver", category: "Pulse (Table Game)"},
      {name: "European Roulette VIP", category: "Pulse (Table Game)"},
      {name: "European Roulette Small Bets", category: "Table Game"},
      {name: "European Roulette", category: "Table Game"},
      {name: "Blackjack Multihand VIP", category: "Table Game"},
      {name: "Blackjack VIP", category: "Table Game"},
      {name: "Blackjack Multihand", category: "Table Game"},
      {name: "Blackjack", category: "Table Game"},
      {name: "Bonus Roulette", category: "Table Game"},
      {name: "European Progressive Roulette", category: "Table Game"},
      {name: "Easy Roulette", category: "Table Game"},
      {name: "Roulette 3D", category: "Table Game"},
      {name: "Baccarat", category: "Table Game"},
      {name: "Blackjack Atlantic City", category: "Table Game"},
      {name: "Blackjack French", category: "Table Game"},
      {name: "Blackjack Multi Hand 3D", category: "Table Game"},
      {name: "Blackjack Reno", category: "Table Game"},
      {name: "Blackjack Super 7's Multihand", category: "Table Game"},
      {name: "Casino Hold'em", category: "Table Game"},
      {name: "Poker Pursuit", category: "Table Game"},
      {name: "Punto Banco", category: "Table Game"},
      {name: "10x Deuce Wild", category: "Video Poker"},
      {name: "25x Deuces Poker", category: "Video Poker"},
      {name: "3x Deuce Poker", category: "Video Poker"},
      {name: "4x Tens or Better", category: "Video Poker"},
      {name: "4x Vegas Joker", category: "Video Poker"},
      {name: "Deuce Wild Progressive", category: "Video Poker"},
      {name: "Deuces and Joker Poker", category: "Video Poker"},
      {name: "Double Joker", category: "Video Poker"},
      {name: "Joker Multitimes", category: "Video Poker"},
      {name: "Joker Poker Big Beer", category: "Video Poker"},
      {name: "Joker Poker Progressive", category: "Video Poker"},
      {name: "Joker Vegas 4UP", category: "Video Poker"},
      {name: "Joker Wheel Bonus", category: "Video Poker"},
      {name: "Joker Wild Poker", category: "Video Poker"},
      {name: "Poker Bowling Strike", category: "Video Poker"},
      {name: "Poker Pursuit Video Poker", category: "Video Poker"},
      {name: "Tens or Better Poker", category: "Video Poker"},
      {name: "Tens or Better Progressive", category: "Video Poker"},
      {name: "Texas Hold'em Joker Poker", category: "Video Poker"},
      {name: "Vegas Joker Poker", category: "Video Poker"}
    ],
    n2: [
      {name: "RNG Traditional Blackjack PT", category: "RNG Game"},
      {name: "RNG Free Bet Blackjack PT", category: "RNG Game"},
      {name: "RNG Blackjack Switch PT", category: "RNG Game"},
      {name: "RNG Roulette", category: "RNG Game"},
      {name: "RNG Roulette PT", category: "RNG Game"},
      {name: "RNG Sicbo", category: "RNG Game"},
      {name: "RNG Sicbo PT", category: "RNG Game"},
      {name: "RNG Baccarat Commission", category: "RNG Game"},
      {name: "RNG Baccarat Non-Commission", category: "RNG Game"},
    ],
    GAMEPLAY: [
      {name: "Legend of Nezha", category: "Slots"},
      {name: "Qi Xi", category: "Slots"},
      {name: "Samurai Sushi", category: "Slots"},
      {name: "Fortune Cat", category: "Slots"},
      {name: "Bikini Beach", category: "Slots"},
      {name: "Queen Bee", category: "Slots"},
      {name: "Pirate's Treasure", category: "Slots"},
      {name: "Fortune Koi", category: "Slots"},
      {name: "Fortune Tree", category: "Slots"},
      {name: "Lady Luck", category: "Slots"},
      {name: "Panda", category: "Slots"},
      {name: "4 Guardians", category: "Slots"},
      {name: "Phoenix", category: "Slots"},
      {name: "Candylicious", category: "Slots"},
      {name: "Fortune Dice", category: "Slots"},
      {name: "World Soccer Slot", category: "Slots"},
      {name: "Three Kingdoms", category: "Slots"},
      {name: "Four Beauties", category: "Slots"},
      {name: "Golf Tour", category: "Slots"},
      {name: "Sweet Treats", category: "Slots"},
      {name: "Cleopatra", category: "Slots"},
      {name: "Lucky Royale", category: "Slots"},
      {name: "Sky Strikers", category: "Slots"},
      {name: "Monsters Cash", category: "Slots"},
      {name: "Trick or Treat", category: "Slots"},
      {name: "Winter Wonderland", category: "Slots"},
      {name: "Wilds and the Beanstalk", category: "Slots"},
      {name: "Zodiac", category: "Slots"},
      {name: "Lady Fortune", category: "Slots"},
      {name: "Hula Girl", category: "Slots"},
      {name: "Genie's Luck", category: "Slots"},
      {name: "World Soccer Slot 2", category: "Slots"},
      {name: "Kung Fu Furry", category: "Slots"},
      {name: "Gem Forest", category: "Slots"},
      {name: "Frost Dragon", category: "Slots"},
      {name: "Jewel Land", category: "Slots"},
      {name: "Money Monkey", category: "Slots"},
      {name: "Alchemist's Spell", category: "Slots"},
      {name: "Chess Royale", category: "Slots"}
    ],
    MICROGAMING: [
      {name: "108 Heroes", category: "Slot"},
      {name: "5 Reel Drive", category: "Slot"},
      {name: "Avalon", category: "Slot"},
      {name: "Badminton Hero", category: "Slot"},
      {name: "Bars And Stripes", category: "Slot"},
      {name: "Basketball Star", category: "Slot"},
      {name: "Big Top", category: "Slot"},
      {name: "Bikini Party", category: "Slot"},
      {name: "Boat of Fortune", category: "Slot"},
      {name: "Break Away", category: "Slot"},
      {name: "Candy Dreams", category: "Slot"},
      {name: "Cricket Star", category: "Slot"},
      {name: "Deck the Halls", category: "Slot"},
      {name: "Dolphin Quest", category: "Slot"},
      {name: "Dragon Dance", category: "Slot"},
      {name: "Dream Date", category: "Slot"},
      {name: "Eagle's Wings", category: "Slot"},
      {name: "Fortunium", category: "Slot"},
      {name: "Girls With Guns - Jungle Heat", category: "Slot"},
      {name: "Gold Factory", category: "Slot"},
      {name: "Golden Era", category: "Slot"},
      {name: "Gung Pow", category: "Slot"},
      {name: "Happy Holidays", category: "Slot"},
      {name: "Highlander", category: "Slot"},
      {name: "Hot Ink", category: "Slot"},
      {name: "Hound Hotel", category: "Slot"},
      {name: "Huangdi - The Yellow Emperor", category: "Slot"},
      {name: "Jurassic World", category: "Slot"},
      {name: "Ladies Nite 2 Turn Wild", category: "Slot"},
      {name: "Lara Croft: Temples and Tombs", category: "Slot"},
      {name: "Loaded", category: "Slot"},
      {name: "Lost Vegas", category: "Slot"},
      {name: "Lucha Legends", category: "Slot"},
      {name: "Lucky Koi", category: "Slot"},
      {name: "Lucky Leprechaun", category: "Slot"},
      {name: "Mad Hatters", category: "Slot"},
      {name: "Mega Money Multiplier", category: "Slot"},
      {name: "Mermaids Millions", category: "Slot"},
      {name: "Mermaids Millions v90", category: "Slot"},
      {name: "Monster Wheels", category: "Slot"},
      {name: "Pistoleras", category: "Slot"},
      {name: "Playboy", category: "Slot"},
      {name: "Pollen Party", category: "Slot"},
      {name: "Reel Gems", category: "Slot"},
      {name: "Retro Reels", category: "Slot"},
      {name: "Retro Reels - Diamond Glitz", category: "Slot"},
      {name: "Retro Reels - Extreme Heat", category: "Slot"},
      {name: "Rhyming Reels Georgie Porgie", category: "Slot"},
      {name: "River of Riches", category: "Slot"},
      {name: "Riviera Riches", category: "Slot"},
      {name: "Rugby Star Deluxe", category: "Slot"},
      {name: "Santa Paws", category: "Slot"},
      {name: "So Much Candy", category: "Slot"},
      {name: "Spring Break", category: "Slot"},
      {name: "Summertime", category: "Slot"},
      {name: "SunTide", category: "Slot"},
      {name: "Tarzan", category: "Slot"},
      {name: "Titans of the Sun - Theia", category: "Slot"},
      {name: "Treasure Palace", category: "Slot"},
      {name: "Wicked Tales: Dark Red", category: "Slot"},
      {name: "Wild Orient", category: "Slot"},
      {name: "Zombie Hoard", category: "Slot"}
    ]
  };

  state = {
    selectedKey: "isb"
  };

  render() {
    return <>
      <div className={styles.menu}>
        <div className={styles["menu-wrap"]}>
          <div className={`${styles["menu-item"]} ${this.state.selectedKey === "isb" ? styles.on : ""}`} onClick={() => this.setState({selectedKey: "isb"})}>ISOFTBET</div>
          <div className={`${styles["menu-item"]} ${this.state.selectedKey === "n2" ? styles.on : ""}`} onClick={() => this.setState({selectedKey: "n2"})}>N2</div>
          <div className={`${styles["menu-item"]} ${this.state.selectedKey === "GAMEPLAY" ? styles.on : ""}`} onClick={() => this.setState({selectedKey: "GAMEPLAY"})}>GAMEPLAY</div>
          <div className={`${styles["menu-item"]} ${this.state.selectedKey === "MICROGAMING" ? styles.on : ""}`} onClick={() => this.setState({selectedKey: "MICROGAMING"})}>MICROGAMING</div>
          {/*<div className={styles["menu-item"]}>GAMEPLAY</div>*/}
          {/*<div className={styles["menu-item"]}>GLOBAL GAMING</div>*/}
        </div>
      </div>
      <div className={styles.exclude}>
        <div className={styles["exclude-panel"]}>
          <div className={styles["panel-header"]}>
            <div className={styles["panel-item"]}>{intl.get("PROMO_EXCLUDE_GAME_NAME")}</div>
            <div className={styles["panel-item"]}>{intl.get("PROMO_EXCLUDE_GAME_CATEGORY")}</div>
          </div>
          {
            this.gameList[this.state.selectedKey].map((item, index) => {
              return <div className={styles["panel-row"]} key={`item${index}`}>
                <div className={styles["panel-item"]}>{item.name}</div>
                <div className={styles["panel-item"]}>{item.category}</div>
              </div>
            })
          }
        </div>
      </div>
    </>
  }
}
