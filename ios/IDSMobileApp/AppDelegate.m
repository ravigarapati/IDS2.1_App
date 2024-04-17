#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <GoogleMaps/GoogleMaps.h>
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate
NSNumber* blur = 0;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  [[NSNotificationCenter defaultCenter] addObserver:self
        selector:@selector(receiveTestNotification:)
        name:@"onBlur"
        object:nil];

  [FIRApp configure];
  [GMSServices provideAPIKey:@"AIzaSyDwMWOZvWCmWt-J84vPmZo9ZUWZJYdYaB8"];
  
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"IDSMobileApp"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];



  return YES;
}

- (void) receiveTestNotification:(NSNotification *) notification
  {

      if ([[notification name] isEqualToString:@"onBlur"]){
          NSDictionary* userInfo = notification.userInfo;
          NSNumber* isBlur = (NSNumber*)userInfo[@"isBlur"];
          blur = isBlur;
          NSLog (@"%@", isBlur);
      }
          
  }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Present a full screen modal view controller to
    // cover its contents when it moves into the background.
    UIVisualEffect *blurEffect; 
    blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
    UIVisualEffectView *visualEffectView;
    visualEffectView = [[UIVisualEffectView alloc] initWithEffect:blurEffect];
    UIViewController *blankViewController = [UIViewController new];
    blankViewController.modalPresentationStyle = UIModalPresentationOverFullScreen;
    // blankViewController.view.backgroundColor = [UIColor colorWithWhite:(1) alpha:(0.5)];
    visualEffectView.frame = blankViewController.view.bounds; 
    [blankViewController.view addSubview:visualEffectView];
    // Pass NO for the animated parameter. Any animation will not complete
    // before the snapshot is taken.
    [self.window.rootViewController presentViewController:blankViewController animated:NO completion:NULL];
  
}

- (void)applicationWillResignActive:(UIApplication *)application{
      if(blur.intValue == 1){
          UIBlurEffect *blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleDark];
          UIVisualEffectView *blurEffectView = [[UIVisualEffectView alloc] initWithEffect:blurEffect];
          //always fill the view
          blurEffectView.frame = self.window.bounds;
          blurEffectView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
          blurEffectView.tag = 181099;
          [self.window addSubview:blurEffectView];
      }
  }

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    [self.window.rootViewController dismissViewControllerAnimated:NO completion:NO];
}

- (void)applicationDidBecomeActive:(UIApplication *)application{
      [[self.window viewWithTag:181099] removeFromSuperview];
  }

@end
